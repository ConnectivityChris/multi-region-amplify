import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import exports from './aws-exports';
import { createBlog } from './graphql/mutations'
import { listBlogs } from './graphql/queries'
import {API, graphqlOperation} from '@aws-amplify/api';
import { v4 as uuid } from 'uuid';

const App = () => {

  const [formState, setFormState] = useState({ name: '' });

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    try {
      const blogData = await API.graphql(graphqlOperation(listBlogs));
      console.log(blogData);
    } catch (err) {
      console.log(JSON.stringify(err, null, 4));
    }
  }

  const onCreateBlogClicked = async () => {
    if (formState.name && formState.name.length > 0) {
      try {
        const input = { name: formState.name, id: uuid() }
        console.log(JSON.stringify(input, null, 4));
        const createdBlog = await API.graphql(graphqlOperation(createBlog, { input }));
        console.log(JSON.stringify(createdBlog, null, 4));
      } catch (err) {
        console.log(JSON.stringify(err, null, 4));
      }
    }
  }

  const onInputChange = (key: string, value: string) => {
    setFormState({...formState, [key]: value});
  }

  return (
    <div className="App">
      <header className="App-header">
        <b>The Region is: {exports.aws_project_region}</b>

        <input id="name" onChange={event => onInputChange('name', event.target.value)} />

        <button onClick={onCreateBlogClicked}>Create Blog</button>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
