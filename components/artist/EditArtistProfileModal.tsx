
import React, { useState, useEffect } from 'react';
import { Artist } from '../../types';
import Icon from '../Icon';

interface EditArtistProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  artist: Artist;
  onSave: (updates: Partial<Artist>) => void;
}

const EditArtistProfileModal: React.FC<EditArtistProfileModalProps> = ({ isVisible, onClose, artist, onSave }) => {
  const [bio, setBio] = useState(artist.bio);
  const [genre, setGenre] = useState(artist.genre);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setBio(artist.bio);
      setGenre(artist.genre);
    }
  }, [isVisible, artist]);

  if (!isVisible) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave({ bio, genre });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="absolute inset-0 bg-white z-[70] flex flex-col animate-fade-in overflow-hidden" aria-modal="true" role="dialog">
      <header className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 relative z-20">
        <h2 className="text-lg font-bold text-gray-900 ml-2">Editar Perfil</h2>
        <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
          <Icon name="close" className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar relative z-10">
          <div className="relative h-36 rounded-2xl overflow-hidden group cursor-pointer bg-gray-100 shadow-sm border border-gray-200">
              <img src={artist.coverImageUrl} alt="Capa" className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-sm flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                      <Icon name="camera" className="w-4 h-4" /> Alterar Capa
                  </span>
              </div>
          </div>
          
          <div className="flex justify-center -mt-20 relative z-10">
              <div className="relative group cursor-pointer">
                  <img src={artist.profileImageUrl} alt="Perfil" className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="camera" className="w-6 h-6 text-white" />
                  </div>
              </div>
          </div>

          <div className="space-y-4">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Gênero Musical</label>
                  <input 
                      type="text" 
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none transition-shadow shadow-sm"
                  />
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Bio</label>
                  <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={5}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 outline-none resize-none transition-shadow shadow-sm"
                  />
              </div>
          </div>
      </div>

      <footer className="p-4 bg-white border-t border-gray-100 shrink-0 pb-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-rose-500 text-white font-bold py-4 px-4 rounded-2xl hover:bg-rose-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-rose-500/20"
        >
          {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
              'Salvar Alterações'
          )}
        </button>
      </footer>
    </div>
  );
};

export default EditArtistProfileModal;
