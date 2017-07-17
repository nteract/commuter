// @flow

type BodyProps = {
  // children: any // literally what's in the flow libdef, we expect a React Element
  children: React$Element<*>
};

const Body = (props: BodyProps) => {
  return (
    <div>
      <div className="main-container">
        {props.children}
      </div>
    </div>
  );
};

export default Body;
