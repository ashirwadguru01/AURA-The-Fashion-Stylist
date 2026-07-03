import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { addToast } from '../../store/slices/uiSlice';
import api from '../../utils/api';

export default function VirtualTryOnPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = MOCK_PRODUCTS.filter(p => p.category === 'Footwear' || p.category === 'Lifestyle' || p.category === 'Men' || p.category === 'Women');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const [streamActive, setStreamActive] = useState(false);
  const [useDemoModel, setUseDemoModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedBox, setDetectedBox] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [overlayStyle, setOverlayStyle] = useState('texture'); // wireframe, texture, heat
  const videoRef = useRef(null);

  const startStream = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreamActive(true);
      setUseDemoModel(false);
      dispatch(addToast({ type: 'success', message: 'Webcam connected' }));
    } catch (err) {
      console.warn('Camera selection rejected/missing', err);
      dispatch(addToast({ type: 'info', message: 'No physical camera detected. Simulated model feed activated.' }));
      setStreamActive(true);
      setUseDemoModel(true);
    } finally {
      setLoading(false);
    }
  };

  const startDemoStream = () => {
    setStreamActive(true);
    setUseDemoModel(true);
    dispatch(addToast({ type: 'success', message: 'Simulated model feed activated' }));
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setStreamActive(false);
    setUseDemoModel(false);
    setCaptured(false);
    setCapturedImage(null);
    setDetectedBox(null);
  };

  const handleCapture = async () => {
    setLoading(true);

    if (useDemoModel) {
      setTimeout(() => {
        setCapturedImage("https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80");
        setDetectedBox({ x: 140, y: 180, width: 360, height: 260 });
        setConfidence(0.98);
        setCaptured(true);
        setLoading(false);
        dispatch(addToast({ type: 'success', message: 'Simulated model fit calculation complete!' }));
      }, 1200);
      return;
    }

    if (!videoRef.current) {
      setLoading(false);
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      // Use actual video sizes
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      // Mirror horizontal flips if desired, but normal is fine
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);

      // Call FastAPI detector endpoint
      const response = await api.post('/api/tryon/detect', { image: dataUrl });
      const { box, confidence: score, detected } = response.data;

      setDetectedBox(box);
      setConfidence(score);
      setCaptured(true);

      if (detected) {
        dispatch(addToast({ type: 'success', message: `YOLO Body Detection Fit: ${(score * 100).toFixed(1)}%` }));
      } else {
        dispatch(addToast({ type: 'info', message: 'Target body outline not detected. Center aligned fitting applied.' }));
      }
    } catch (err) {
      console.error(err);
      dispatch(addToast({ type: 'error', message: 'AI try-on computation failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr minmax(320px, 380px)', height: '100%', overflow: 'hidden' }}>
        
        {/* Left: Viewport */}
        <div style={{ background: '#09090b', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', overflow: 'hidden' }}>
          {streamActive ? (
            useDemoModel ? (
              <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
                <img 
                  src={capturedImage || "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"} 
                  alt="Model Fit Scan"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                {!captured && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0), var(--purple2), rgba(197, 168, 128, 0))',
                    boxShadow: '0 0 15px var(--purple2)',
                    animation: 'sweep 3s ease-in-out infinite',
                    zIndex: 2
                  }} />
                )}
              </div>
            ) : (
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} autoPlay playsInline muted />
            )
          ) : (
            <div style={{ textAlign: 'center', color: '#fff', padding: '2rem' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📷</span>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: '1.5rem', letterSpacing: '2px', margin: '1rem 0' }}>WEBCAM IS INACTIVE</p>
              <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '2rem', maxWidth: 360, margin: '0 auto 2rem' }}>
                To overlay shoes/clothing virtually, allow our YOLO engine to scan your camera feeds in real-time.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={startStream}>
                  {loading ? 'OPENING...' : 'ALLOW CAMERA ACCESS'}
                </button>
                <button className="btn btn-secondary" onClick={startDemoStream}>
                  USE SIMULATED DEMO FEED
                </button>
              </div>
            </div>
          )}

          {/* Live Overlay Markers */}
          {streamActive && !captured && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-hot" style={{ animation: 'pulse 1.2s infinite', background: 'var(--purple2)' }}>● LIVE YOLO ALIGNMENT</span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: '4px' }}>
                  Model: YOLOv8-Pose (v8.1)
                </span>
              </div>

              <div style={{ alignSelf: 'center', border: '2px dashed var(--purple2)', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -5, left: -5, width: 20, height: 20, borderTop: '4px solid var(--purple2)', borderLeft: '4px solid var(--purple2)' }} />
                <div style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderTop: '4px solid var(--purple2)', borderRight: '4px solid var(--purple2)' }} />
                <div style={{ position: 'absolute', bottom: -5, left: -5, width: 20, height: 20, borderBottom: '4px solid var(--purple2)', borderLeft: '4px solid var(--purple2)' }} />
                <div style={{ position: 'absolute', bottom: -5, right: -5, width: 20, height: 20, borderBottom: '4px solid var(--purple2)', borderRight: '4px solid var(--purple2)' }} />
                
                <p style={{ color: 'var(--purple2)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center', padding: '10px' }}>
                  POSITION BODY CENTERED HERE
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <button style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--border)', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.75rem', cursor: 'pointer', borderRadius: '4px' }} onClick={stopStream}>
                  ✕ CLOSE FEED
                </button>
                <button style={{ pointerEvents: 'auto', background: 'var(--purple)', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }} onClick={handleCapture} disabled={loading}>
                  {loading ? 'PROCESSING...' : 'SNAP & TRY ON'}
                </button>
              </div>
            </div>
          )}

          {/* Captured Bounding Box Fitting Projection */}
          {streamActive && captured && detectedBox && (
            <div style={{ position: 'absolute', inset: 0, background: '#0f0f12', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '100%', maxHeight: '450px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                
                {/* Captured camera frame */}
                <img 
                  src={capturedImage} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: useDemoModel ? 'none' : 'scaleX(-1)' }} 
                />

                {/* YOLO Bounding Box Alignment Overlay */}
                <div style={{
                  position: 'absolute',
                  // Handle mirrored webcam flip
                  left: useDemoModel ? `${(detectedBox.x / 640) * 100}%` : `${(1 - (detectedBox.x + detectedBox.width) / 640) * 100}%`,
                  top: `${(detectedBox.y / 480) * 100}%`,
                  width: `${(detectedBox.width / 640) * 100}%`,
                  height: `${(detectedBox.height / 480) * 100}%`,
                  backgroundImage: `url(${selectedProduct.images[0]})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  opacity: overlayStyle === 'wireframe' ? 0.5 : 1.0,
                  filter: overlayStyle === 'heat' ? 'hue-rotate(180deg) saturate(4)' : 'none',
                  border: overlayStyle === 'wireframe' ? '2px dashed var(--purple2)' : 'none',
                  transition: 'all 0.2s'
                }} />

                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.85)', padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.6rem', color: 'var(--text2)', letterSpacing: '1px', textTransform: 'uppercase' }}>Match confidence</p>
                  <p style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--green)' }}>{(confidence * 100).toFixed(2)}% EXCELLENT FIT</p>
                </div>
              </div>

              {/* Viewport Control Panel */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', zIndex: 10 }}>
                {[['wireframe', '🌐 WIREFRAME'], ['texture', '🎨 3D OVERLAY'], ['heat', '🔥 FIT MAP']].map(([k, l]) => (
                  <button key={k} onClick={() => setOverlayStyle(k)}
                    style={{ background: overlayStyle === k ? 'var(--purple)' : 'rgba(0,0,0,0.6)', color: '#fff', border: overlayStyle === k ? '1px solid var(--purple2)' : '1px solid var(--border)', padding: '0.4rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}>
                    {l}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }} onClick={() => setCaptured(false)}>
                  ✕ RETAKE
                </button>
                <button className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.7rem' }} onClick={() => navigate(`/product/${selectedProduct.id}`)}>
                  VIEW DETAILS & RESERVE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controller Sidebar */}
        <div style={{ padding: '2rem 1.5rem', background: 'var(--bg2)', borderLeft: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '0.25rem' }}>TRY-ON DIRECTORY</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Select a product from inventory to project virtually</p>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {products.map(p => (
              <div key={p.id} onClick={() => { setSelectedProduct(p); setCaptured(false); }}
                style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem', border: `1px solid ${selectedProduct.id === p.id ? 'var(--text)' : 'var(--border)'}`, background: selectedProduct.id === p.id ? 'var(--surface)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s', borderRadius: '4px' }}>
                <div style={{ width: 50, height: 50, overflow: 'hidden', background: 'var(--bg3)', borderRadius: '4px' }}>
                  <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.brand}</p>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, margin: '1px 0' }}>{p.name}</p>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600 }}>₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--border)', background: 'var(--bg3)', fontSize: '0.7rem', color: 'var(--text2)', borderRadius: '4px' }}>
            <p style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem', fontSize: '0.75rem' }}>✦ COMPUTATIONAL NOTE</p>
            The frames are processed using Haar Cascade algorithms to detect body placement. Bounding box coordinates are then calculated to overlay selection coordinates dynamically.
          </div>
        </div>

      </div>
    </div>
  );
}
