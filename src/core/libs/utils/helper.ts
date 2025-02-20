import { APP_CONFIG } from "@/core/config";
import { v4 as uuidv4 } from "uuid";
import { getExtension } from "hono/utils/mime";

export const saveFileToStatic = async (kind: string, file: File) => {
  try {
    const extention = getExtension(file.type);
    const name = `${uuidv4()}.${extention}`;
    const destination = `${APP_CONFIG.static.location}/${kind}/${name}`;
    const filePath = `/static/${kind}/${name}`;
    await Bun.write(destination, file);
    return filePath;
  } catch (err: any) {
    console.log("err saveFileToStatic", err);
    throw err;
  }
};
