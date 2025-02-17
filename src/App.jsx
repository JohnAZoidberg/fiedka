import React, { useEffect, useState } from "react";
import { Button, LoadingAnimation } from "@coalmines/indui";
import { useFilePicker } from "use-file-picker";
import wasm from "./main.go";
import UEFIImage from "./UEFIImage";
import colors from "./util/colors";

const { fmap, utka } = wasm;

const Analyze = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [openFileSelector, { filesContent, loading, errors, plainFiles }] =
    useFilePicker({
      multiple: true,
      readAs: "ArrayBuffer",
      // accept: ['.bin', '.rom'],
      limitFilesConfig: { min: 1, max: 1 },
      // minFileSize: 1, // in megabytes
      maxFileSize: 65,
      // readFilesContent: false, // ignores file content
    });

  const analyze = async (indata, size) => {
    setData(null);
    setError(null);
    // TODO: fmap should never fail, what should we do if it does though?
    try {
      const res = await Promise.allSettled([
        fmap(indata, size),
        utka(indata, size),
      ]);
      setData({
        fmap: JSON.parse(res[0].value),
        utk: res[1].status === "fulfilled" ? JSON.parse(res[1].value) : {},
      });
      res.forEach((r) => {
        if (r.status === "rejected") {
          console.error(r.reason);
          setError((errors || []).concat([r.reason]));
        }
      });
    } catch (e) {
      console.error(e);
      setError((errors || []).concat(e));
    }
  };

  useEffect(() => {
    if (filesContent.length) {
      const f = filesContent[0].content;
      analyze(new Uint8Array(f), f.byteLength);
    }
  }, [filesContent]);

  const fileName = plainFiles.length > 0 ? plainFiles[0].name : "";

  return (
    <div style={{ fontSize: 9 }}>
      <Button onClick={() => openFileSelector()}>
        {loading ? (
          <>
            <LoadingAnimation type="gigagampfa">⚙️⚙️</LoadingAnimation>
            Analyzing...{" "}
          </>
        ) : (
          "Select file"
        )}
      </Button>
      {error && (
        <p className="error">
          <h2>Errors</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </p>
      )}
      {data && <UEFIImage data={data.utk} fmap={data.fmap} name={fileName} />}
      <style jsx>{`
        .error {
          max-width: 420px;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

const App = () => (
  <div>
    <h1>Fiedka - analyze a firmware image</h1>
    <Analyze />
    <h2>TPM log demo</h2>
    <style jsx global>{`
      html {
        box-sizing: border-box;
        scroll-behavior: smooth;
      }
      body {
        margin: 0;
        background-color: #dedede;
        font-size: 12px;
      }
      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }
      .block {
        display: inline-block;
        width: 8px;
        height: 8px;
      }
    `}</style>
    <style jsx global>{`
      .block-used {
        background-color: ${colors[25]};
      }
      .block-full {
        background-color: ${colors[14]};
      }
      .block-zero {
        background-color: ${colors[9]};
      }
      .block-marked {
        background-color: ${colors[6]};
      }
      .block-hovered-marked {
        background-color: ${colors[4]};
      }
      .block-hovered {
        background-color: ${colors[2]};
      }
    `}</style>
  </div>
);

export default App;
