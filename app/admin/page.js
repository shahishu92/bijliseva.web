"use client";

import React, { useEffect, useState } from "react";
import "../globals.css"; // agar aapne global css ka path alag rakha ho to adjust karo
import app, { db, storage } from "@/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { getDownloadURL, ref as sref } from "firebase/storage";

export default function AdminPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setApps(arr);
      setLoading(false);
    }, (err) => {
      console.error("Firestore onSnapshot error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openDetails = async (item) => {
    // If files are present, try to ensure we have download URLs (they should already be stored)
    setSelected(item);
  };

  const changeStatus = async (id, next) => {
    setChanging(true);
    try {
      const d = doc(db, "applications", id);
      await updateDoc(d, { status: next, updatedAt: serverTimestamp() });
    } catch (err) {
      alert("Status update failed: " + (err.message || err));
    } finally {
      setChanging(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "auto" }}>
      <h1>BIJLI — Admin Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1, minWidth: 380 }}>
          <h3>Applications {loading ? "(loading...)" : `(${apps.length})`}</h3>
          <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
            {apps.length===0 && !loading && <div style={{padding:10}}>No applications yet</div>}
            {apps.map(a => (
              <div key={a.id} style={{ padding: 10, borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                   onClick={() => openDetails(a)}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong>{a.name || "—"}</strong><br/>
                    <small>{a.phone || "—"}</small>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>{a.serviceType}</div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ padding: "4px 8px", borderRadius: 6, background: a.status==="Submitted" ? "#ffd" : a.status==="Processing" ? "#def" : "#dfd" }}>
                        {a.status || "Submitted"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 2 }}>
          {!selected && <div style={{ padding: 20 }}>Select an application to view details</div>}
          {selected && (
            <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
              <h3>Details</h3>
              <div><strong>Name:</strong> {selected.name}</div>
              <div><strong>Phone:</strong> {selected.phone}</div>
              <div><strong>Service:</strong> {selected.serviceType}</div>
              <div><strong>Status:</strong> {selected.status}</div>
              <div style={{ marginTop: 12 }}>
                <strong>Files:</strong>
                <div>
                  {Array.isArray(selected.files) && selected.files.length>0 ? selected.files.map((f, i) => (
                    <div key={i} style={{ marginTop: 8 }}>
                      <div><strong>{f.name}</strong> ({Math.round((f.size||0)/1024)} KB)</div>
                      <div style={{ marginTop: 6 }}>
                        <a href={f.url} target="_blank" rel="noreferrer">Open / Download</a>
                      </div>
                    </div>
                  )) : <div style={{ marginTop: 8 }}>No files uploaded</div>}
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <button onClick={() => changeStatus(selected.id, "Processing")} disabled={changing} style={{ marginRight: 8 }}>
                  Mark Processing
                </button>
                <button onClick={() => changeStatus(selected.id, "Done")} disabled={changing} style={{ marginRight: 8 }}>
                  Mark Done
                </button>
                <button onClick={() => changeStatus(selected.id, "Submitted")} disabled={changing}>
                  Mark Submitted
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                <button onClick={() => {
                  // go back to list
                  setSelected(null);
                }}>
                  Back to list
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 30, color: "#777", fontSize: 13 }}>
        Note: This admin panel is not protected. For production, add authentication (Firebase Auth / Admin roles) and tighten Firestore rules.
      </div>
    </div>
  );
}
