import { ChangeEvent, FormEvent, useRef, useState } from "react";

function App() {
  // Ref to the file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Function to handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file && file.length) {
      setSelectedFile(file[0]);
    }
  };

  // Function to handle file upload
  const handleUpload = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = selectedFile;
    const chunk_size = 1024 * 1024; // Chunk size set to 1 MB
    let offset = 0;
    let chunk_number = 0;
    if (file) {
      // Loop until all chunks are uploaded
      while (offset < file?.size) {
        // Slice the file into chunks
        const chunk = selectedFile.slice(offset, offset + chunk_size);

        // Create a blob from the chunk
        const chunk_blob = new Blob([chunk], { type: file.type });

        // Create a FormData object to send chunk data
        const formData = new FormData();
        formData.append("file", chunk_blob);
        formData.append("name", file.name);
        formData.append("chunk_number", String(chunk_number));
        formData.append(
          "total_chunks",
          String(Math.ceil(file?.size / chunk_size))
        );

        // Send the chunk data to the server using fetch API
        await fetch("http://127.0.0.1:3000/uploads", {
          method: "POST",
          body: formData,
        });

        // Update offset and chunk number for the next iteration
        offset += chunk_size;
        chunk_number += 1;
      }
    }
  };

  return (
    <div className="container">
      <form>
        {/* File selector */}
        <div
          className="fileSelector"
          onClick={() => fileInputRef.current?.click()}
        >
          <img src="/plus.jpg" alt="plus" />
        </div>{" "}
        <br />
        {/* Display selected file name */}
        <span>{selectedFile ? selectedFile.name : "Nothing Selected"}</span>
        {/* Hidden file input */}
        <input
          type="file"
          name="file"
          id="file"
          className="none"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <br />
        {/* Upload button */}
        <button type="submit" className="btn" onClick={handleUpload}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default App;
