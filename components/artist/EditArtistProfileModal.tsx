
import React, { useState, useEffect } from 'react';
import { Artist } from '../../types';
import Icon from '../Icon';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalShell, ModalTitle } from '../ui/modal-shell';
import { Textarea } from '../ui/textarea';

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
    <ModalShell open={isVisible} onClose={onClose} variant="fullscreen" className="absolute inset-0 z-[70]">
      <ModalHeader className="bg-white">
        <ModalTitle className="ml-2">Editar Perfil</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>

      <ModalBody className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
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
                  <Input
                      type="text" 
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                  />
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Bio</label>
                  <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={5}
                      className="min-h-32 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:border-rose-300 focus-visible:ring-rose-500/25"
                  />
              </div>
          </div>
      </ModalBody>

      <ModalFooter className="pb-8">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-14 w-full rounded-2xl text-sm font-black shadow-lg shadow-rose-500/20"
        >
          {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
              'Salvar Alterações'
          )}
        </Button>
      </ModalFooter>
    </ModalShell>
  );
};

export default EditArtistProfileModal;
