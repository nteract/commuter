export default props => {
  console.log(props);
  return (
    <div>
      <p>view it</p>
      <pre>
        {JSON.stringify(props.url.query.viewPath)}
      </pre>
    </div>
  );
};
