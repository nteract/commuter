export default props => {
  console.log(props);
  return (
    <div>
      <p>view</p>
      <pre>
        {JSON.stringify(props.url.query.viewPath)}
      </pre>
    </div>
  );
};
