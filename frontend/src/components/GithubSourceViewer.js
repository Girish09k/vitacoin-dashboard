import React, { useEffect, useState } from "react";

const GITHUB_FILE_URL = "https://raw.githubusercontent.com/Girish09k/vitacoin-dashboard/main/src/api/api.js";

function GithubSourceViewer() {
  const [source, setSource] = useState("");

  useEffect(() => {
    fetch(GITHUB_FILE_URL)
      .then(resp => resp.text())
      .then(text => setSource(text));
  }, []);

  return (
    <pre>
      <code>
        {source}
      </code>
    </pre>
  );
}

export default GithubSourceViewer;
