import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { PlusCircle, Upload, Eye, Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AddPrompt = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Coding');
  const [aiTool, setAiTool] = useState('ChatGPT');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [visibility, setVisibility] = useState('public');
  
  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [thumbnailName, setThumbnailName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const categories = ['Coding', 'Writing', 'Marketing', 'Graphics & Image', 'Idea Generation', 'System Assistant', 'Other'];
  const aiTools = ['ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'Stable Diffusion', 'Other'];

  // Handle local file selection
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error('File size too large. Maximum size is 2MB.');
      }
      setImageFile(file);
      setThumbnailName(file.name);

      // FileReader for preview purposes only
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !content || !category || !aiTool) {
      return toast.warning('Please enter all required fields.');
    }

    try {
      setBtnLoading(true);

      let uploadedImageUrl = '';

      // Upload file to Cloudinary first if present
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Image upload failed');
        }
        uploadedImageUrl = uploadData.secure_url;
      }
      
      // Split tags by comma, trim whitespaces
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');

      const response = await fetch(`${API_URL}/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          content,
          category,
          aiTool,
          tags: tagsArray,
          difficulty,
          thumbnailURL: uploadedImageUrl,
          visibility,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Prompt created successfully! Pending admin approval.');
        navigate('/dashboard/my-prompts');
      } else {
        toast.error(data.message || 'Failed to submit prompt template');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Network error creating prompt');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create New Prompt Template</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Fill in details to submit a prompt to the community catalog.</p>
      </div>

      <div className="glass-panel" style={{ padding: '40px', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="prompt-title">Prompt Title *</label>
            <input
              type="text"
              id="prompt-title"
              className="form-input"
              placeholder="e.g. Optimized React Tailwind Card Builder"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={btnLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prompt-desc">Short Description *</label>
            <input
              type="text"
              id="prompt-desc"
              className="form-input"
              placeholder="Explain what this prompt accomplishes in 1-2 sentences"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={btnLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prompt-content">Prompt Content Template *</label>
            <textarea
              id="prompt-content"
              className="form-textarea"
              placeholder="Write the full, detailed prompt instructions. Use brackets to indicate variables e.g., 'Act as a [role]...'"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={btnLoading}
              style={{ minHeight: '160px' }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          }}>
            <div className="form-group">
              <label className="form-label" htmlFor="prompt-cat">Category *</label>
              <select
                id="prompt-cat"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={btnLoading}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prompt-tool">AI Engine *</label>
              <select
                id="prompt-tool"
                className="form-select"
                value={aiTool}
                onChange={(e) => setAiTool(e.target.value)}
                disabled={btnLoading}
              >
                {aiTools.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          }}>
            <div className="form-group">
              <label className="form-label" htmlFor="prompt-difficulty">Difficulty Level *</label>
              <select
                id="prompt-difficulty"
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={btnLoading}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Pro">Pro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Visibility Status *</label>
              <div style={{ display: 'flex', gap: '24px', height: '42px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="visibility-choice"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    disabled={btnLoading}
                  />
                  Public (Free access)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="visibility-choice"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                    disabled={btnLoading}
                  />
                  Private (Premium lock)
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prompt-tags">Tags (Comma-separated)</label>
            <input
              type="text"
              id="prompt-tags"
              className="form-input"
              placeholder="e.g. tailwind, card, component, responsive"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={btnLoading}
            />
          </div>

          {/* Image Upload Box */}
          <div className="form-group">
            <label className="form-label">Thumbnail Image upload</label>
            <div style={{
              border: '2px dashed rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                disabled={btnLoading}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxHeight: '120px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{thumbnailName}</span>
                </div>
              ) : (
                <>
                  <Upload size={32} style={{ color: '#64748b' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#f8fafc' }}>
                      Click to choose a thumbnail image file
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Supports PNG, JPG, or WEBP (Max 2MB)
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className="btn btn-primary"
            style={{ height: '48px', marginTop: '16px' }}
          >
            <PlusCircle size={18} />
            <span>{btnLoading ? 'Publishing prompt template...' : 'Submit Prompt for Review'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPrompt;

// Thumbnail drag uploader specs details
