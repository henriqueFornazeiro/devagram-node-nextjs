import multer from "multer";
import cosmicjs from "cosmicjs";

const {
  KEY_SAVE_AVATAR,
  KEY_SAVE_PUBLICATION,
  BUCKET_AVATAR,
  BUCKET_PUBLICATION,
} = process.env;

const Cosmic = cosmicjs();

const bucketAvatar = Cosmic.bucket({
  slug: BUCKET_AVATAR,
  write_key: KEY_SAVE_AVATAR,
});

const bucketPublication = Cosmic.bucket({
  slug: BUCKET_PUBLICATION,
  write_key: KEY_SAVE_PUBLICATION,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImageCosmic = async (req: any) => {
  if (req?.file?.originalname) {
    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    };

    if (req.url && req.url.includes("publication")) {
      return await bucketPublication.addMedia({media: media_object });
    } else {
      return await bucketAvatar.addMedia({media: media_object });
    }
  }
};

export {upload, uploadImageCosmic}
