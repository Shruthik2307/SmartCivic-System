import React, { useState } from "react";
import { db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CitizenPage() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Garbage");
  const [desc, setDesc] = useState("");

  const handleSubmit = async () => {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const imgRef = ref(storage, `complaints/${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);

      await addDoc(collection(db, "COMPLAINTS"), {
        category,
        description: desc,
        lat,
        lng,
        image_url: url,
        status: "Pending",
        priority: 3,
        department: "Sanitation",
        created_at: new Date()
      });

      alert("Complaint Submitted");
    });
  };

  return (
    <div>
      <h2>Submit Complaint</h2>

      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <br />

      <select onChange={e => setCategory(e.target.value)}>
        <option>Garbage</option>
        <option>Pothole</option>
        <option>Streetlight</option>
        <option>Drainage</option>
      </select>

      <br />

      <textarea
        placeholder="Description"
        onChange={e => setDesc(e.target.value)}
      />

      <br />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}