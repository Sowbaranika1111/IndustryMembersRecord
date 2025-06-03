import React from 'react';
import industryXBG from '../assets/image.png'

export default function Home() {
  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif' }}>
      {/* Header with image and overlay search */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        overflow: 'hidden'  // ensures blur doesn't overflow edges
      }}>
        {/* Background with vignette + blur */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
    radial-gradient(circle at center, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.5) 100%),
    url(${industryXBG})
  `,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        {/* Search bar overlay */}
        <input
          type="text"
          placeholder="Search by emp"
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            fontSize: '16px',
            width: '80%',
            maxWidth: '500px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1,
          }}
        />
      </div>


      {/* Content below the header */}
      <div style={{ display: 'flex', padding: '30px 20px', gap: '20px' }}>
        {/* Left section: text */}
        <div style={{ flex: 2 }}>
          <h2 style={{ color: '#A100FF' }}>About Industry X</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            Industry X is Accenture’s digital transformation initiative focused on smart manufacturing, connected products,
            and the future of operations. We combine innovation, technology, and engineering to transform traditional
            industries and build more agile, efficient, and sustainable operations.
          </p>
        </div>

        {/* Right section: image */}
        <div style={{ flex: 1 }}>
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#eee',
            backgroundImage: 'url("https://cdn.slidesharecdn.com/ss_thumbnails/industryx-170907025737-thumbnail-4.jpg?cb=1504808605")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px'
          }} />
        </div>
      </div>
    </div>
  );
}
