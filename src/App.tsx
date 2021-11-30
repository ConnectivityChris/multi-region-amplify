import React, { useEffect, useState } from 'react';
import './App.css';
import exports from './aws-exports';
import { createBlog } from './graphql/mutations'
import { listBlogs } from './graphql/queries'
import { onCreateBlog } from './graphql/subscriptions'
import {API, graphqlOperation, GraphQLResult} from '@aws-amplify/api';
import { v4 as uuid } from 'uuid';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { ListBlogsQuery } from './API';

const App = () => {

  const [formState, setFormState] = useState({ name: '' });
  const [blogs, setBlogs] = useState<Array<any>>([]);

  useEffect(() => {
    const subscribeToBlogCreation = async () => {
      const subscription = await API.graphql(graphqlOperation(onCreateBlog)) as any;
      subscription.subscribe({
        next: (next: any) => addBlogToList(next.value.data.onCreateBlog),
        error: (error: any) => console.warn(error)
      });
    }

    const addBlogToList = (newBlog: any) => {
      console.log("newblog:", newBlog);
      setBlogs((blogs) => ([...blogs, newBlog]));
    }

    getBlogs();
    subscribeToBlogCreation();
  }, []);


  const getBlogs = async () => {
    try {
      const blogData = await API.graphql(graphqlOperation(listBlogs)) as GraphQLResult<object>;
      if (blogData && blogData.data) {
        const blogsList = blogData.data as ListBlogsQuery;
        if (blogsList.listBlogs && blogsList.listBlogs.items) {
          setBlogs(blogsList.listBlogs.items);
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 4));
    }
  }

  const onCreateBlogClicked = async () => {
    if (formState.name && formState.name.length > 0) {
      try {
        const input = { name: formState.name, id: uuid() }
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
        <b>The Repository is GitHub.</b>

        <input id="name" onChange={event => onInputChange('name', event.target.value)} />

        <button onClick={onCreateBlogClicked}>Create Blog</button>
        
        <span>There are {blogs.length} total blog(s) in the database:</span>

        {blogs.map(blog => (
          <div key={blog.id}>Blog Name: <a href={blog.id}>{blog.name}</a></div>
        ))}

      </header>
    </div>
  );
}

export default withAuthenticator(App);
