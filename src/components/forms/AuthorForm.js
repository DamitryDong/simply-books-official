'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { updateAuthor, createAuthor } from '../../api/authorData';

const initialState = {
  email: '',
  image: '',
  first_name: '',
  last_name: '',
  favorite: false,
};

function AuthorForm({ obj = initialState }) {
  const [formInput, setFormInput] = useState(obj);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateAuthor(formInput).then(() => router.push(`/authors/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createAuthor(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateAuthor(patchPayload).then(() => {
          router.push('/authors'); // these routers are used so after we update, we return to the authors page.
        });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="text-black">
      <h2 className="text-black">{obj.firebaseKey ? 'Update' : 'Create'} Book</h2>

      {/* TITLE INPUT */}
      <FloatingLabel controlId="floatingInput1" label="Author First Name" className="mb-3 text-black">
        <Form.Control type="text" placeholder="John" name="first_name" value={formInput.first_name} onChange={handleChange} required className="text-black" />
      </FloatingLabel>

      {/* IMAGE INPUT */}
      <FloatingLabel controlId="floatingInput2" label="Author Last Name" className="mb-3 text-black">
        <Form.Control type="text" placeholder="Smith" name="last_name" value={formInput.last_name} onChange={handleChange} required className="text-black" />
      </FloatingLabel>

      {/* PRICE INPUT */}
      <FloatingLabel controlId="floatingInput3" label="Author Email" className="mb-3 text-black">
        <Form.Control type="text" placeholder="111@gggg.com" name="email" value={formInput.email} onChange={handleChange} required className="text-black" />
      </FloatingLabel>

      {/* DESCRIPTION TEXTAREA */}
      <FloatingLabel controlId="floatingTextarea" label="Image" className="mb-3 text-black">
        <Form.Control type="url" placeholder="Image URL" name="image" value={formInput.image} onChange={handleChange} required className="text-black" />
      </FloatingLabel>

      {/* A WAY TO HANDLE UPDATES FOR TOGGLES, RADIOS, ETC */}
      <Form.Check
        className="text-black mb-3"
        type="switch"
        id="favorite"
        name="favorite"
        label="favorite?"
        checked={formInput.favorite}
        onChange={(e) => {
          setFormInput((prevState) => ({
            ...prevState,
            favorite: e.target.checked,
          }));
        }}
      />

      {/* SUBMIT BUTTON */}
      <Button type="submit" className="text-black">
        {obj.firebaseKey ? 'Update' : 'Create'} Author
      </Button>
    </Form>
  );
}

AuthorForm.propTypes = {
  obj: PropTypes.shape({
    email: PropTypes.string,
    image: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    favorite: PropTypes.bool,
    firebaseKey: PropTypes.string,
  }),
};

export default AuthorForm;
