import React from "react";

export default function PageFooter() {
  return (
    <div className="bg-dark mx-auto text-center fixed-bottom sticky-bottom mt-3 p-1">
      <a href="https://github.com/JoakimEwenson/react-temp">
        <i className="fab fa-github footerIcon px-2"></i>
      </a>
      <a href="https://twitter.com/JoakimEwenson">
        <i class="fab fa-twitter footerIcon px-2"></i>
      </a>
      <a href="https://www.linkedin.com/in/joakim-ewenson-a1586377/">
        <i class="fab fa-linkedin-in footerIcon px-2"></i>
      </a>
      <a href="https://www.ewenson.se"><i class="fab fa-wordpress footerIcon px-2"></i></a>
    </div>
  );
}
