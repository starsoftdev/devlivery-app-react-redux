## Data Fetching

At a bare minimum you may want to use [HTML5 Fetch API][fetch] as an HTTP client utility for
making Ajax request to the [data API server][nodeapi]. This API is supported natively in all the
major browsers except for IE (note, that Edge browser does support Fetch).

**React Starter Kit** is pre-configured with [`whatwg-fetch`][wfetch] polyfill for the browser
environment and [`node-fetch`][nfetch] module for the server-side environment (see
[`src/createFetch.js`](../src/createFetch.js)), allowing you to use the `fetch(url, options)`
method universally in both the client-side and server-side code bases.

#### Route Example

```js
{
  path: '/posts/:id',
  async action({ params, fetch }) {
    const resp = await fetch(`/api/posts/${params.id}`, { method: 'GET' });
    const data = await resp.json();
    return { title: data.title, component: <Post {...data} /> };
  }
}
```

#### React Component

```js
class Post extends React.Component {
  static contextTypes = { fetch: PropTypes.func.isRequired };
  handleDelete = (event) => {
    event.preventDefault();
    const id = event.target.dataset['id'];
    this.context.fetch(`/api/posts/${id}`, { method: 'DELETE' }).then(...);
  };
  render() { ... }
}
```

#### Related articles

* [That's so fetch!](https://jakearchibald.com/2015/thats-so-fetch/) by [Jake Archibald](https://twitter.com/jaffathecake)


[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
[wfetch]: https://github.com/github/fetchno
[nfetch]: https://github.com/bitinn/node-fetch
[nodeapi]: https://github.com/kriasoft/nodejs-api-starter

