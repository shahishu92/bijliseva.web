"use client";

import React, { useState } from "react";
import app, { db, storage } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  ref as sref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import imageCompression from "browser-image-compression";

export default function ApplyPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("Change of Name");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) return alert("Please enter name and phone");
    setLoading(true);
    try {
      const timestamp = Date.now();
      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        let uploadFile = f;

        if (f.type.startsWith("image/")) {
          const compressed = await imageCompression(f, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1600,
            useWebWorker: true
          });
          uploadFile = compressed;
        }

        const storageRef = sref(storage, `applications/${timestamp}_${i}_${f.name}`);
        const buf = await uploadFile.arrayBuffer();
        await uploadBytes(storageRef, new Uint8Array(buf));
        const url = await getDownloadURL(storageRef);
        uploaded.push({ name: f.name, url, size: uploadFile.size, type: f.type });
      }

      const docRef = await addDoc(collection(db, "applications"), {
        name,
        phone,
        serviceType,
        files: uploaded,
        status: "Submitted",
        createdAt: serverTimestamp()
      });

      setMessage("✅ Application submitted successfully! Ref: " + docRef.id);
      setName("");
      setPhone("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Submit error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <h1>⚡ BIJLI – Online Service Request</h1>
      <form onSubmit={handleSubmit}>
        <label>Consumer Name</label><br/>
        <input value={name} onChange={(e)=>setName(e.target.value)} required style={{width:"100%", padding:8}} /><br/><br/>
        
        <label>Mobile Number</label><br/>
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} required style={{width:"100%", padding:8}} /><br/><br/>
        
        <label>Service Type</label><br/>
        <select value={serviceType} onChange={(e)=>setServiceType(e.target.value)} style={{width:"100%", padding:8}}>
          <option>Change of Name</option>
          <option>New Single-Phase Meter</option>
          <option>New Three-Phase Meter</option>
          <option>Load Extension</option>
          <option>Factory / Industrial NOC</option>
        </select><br/><br/>
        
        <label>Upload Documents (photos or PDF)</label><br/>
        <input type="file" multiple accept="image/*,application/pdf" onChange={onFileChange} /><br/><br/>
        
        <button type="submit" disabled={loading} style={{padding:"10px 16px"}}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {message && <p style={{marginTop:20, fontWeight:"bold"}}>{message}</p>}
    </div>
  );
}
