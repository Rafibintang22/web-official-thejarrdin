import React from "react";

function MainContent({ header, content, footer }) {
  return (
    <>
      {footer ? (
        <>
          {header && header}
          {content && content}
          {footer && footer}
        </>
      ) : (
        <div className="container-content w-100 h-100 d-flex flex-column bg-light">
          {header && header}
          {content && content}
        </div>
      )}
    </>
  );
}

export default MainContent;
