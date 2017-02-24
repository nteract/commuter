const express = require("express"), router = express.Router();

router.get("/*", (req, res) => {
  res.json({
    results: [
      {
        name: "IMDB Ratings",
        created: "2016-10-10T13:41:34.629929+00:00",
        last_modified: "2016-09-30T08:19:47+00:00",
        mimetype: "application/x-ipynb+json",
        format: "json",
        type: "notebook",
        path: "/kylek/ipynb/IMDB.ipynb",
        metadata: {
          title: "Named Display Updates",
          authors: [
            {
              name: "Paul Ivanov"
            },
            {
              name: "Kyle Kelley"
            }
          ],
          nteract: {
            tags: ["ipython", "display updates", "progress-bars"],
            description: "A Progressive look at updating outputs programmatically from IPython",
            image: "https://cloud.githubusercontent.com/assets/836375/23152279/e945b5ee-f7b5-11e6-9798-9bffa5026aa7.png"
          },
          kernelspec: {
            name: "python3",
            language: "python",
            display_name: "Python 3"
          },
          kernel_info: {
            name: "python3"
          },
          language_info: {
            codemirror_mode: {
              name: "ipython",
              version: 3
            },
            nbconvert_exporter: "python",
            mimetype: "text/x-python",
            version: "3.5.2",
            file_extension: ".py",
            name: "python",
            pygments_lexer: "ipython3"
          }
        }
      }
    ]
  });
});

module.exports = router;
