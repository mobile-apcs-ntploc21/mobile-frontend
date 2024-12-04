import { AttachmentTypes } from '@/types/attachment';

export const getAttachmentType = (mimeType?: string): AttachmentTypes => {
  if (!mimeType) {
    return AttachmentTypes.File;
  }
  if (mimeType.startsWith('image')) {
    return AttachmentTypes.Image;
  } else if (mimeType.startsWith('video')) {
    return AttachmentTypes.Video;
  } else if (mimeType.startsWith('audio')) {
    return AttachmentTypes.Audio;
  } else {
    return AttachmentTypes.File;
  }
};
