import { APP_CONFIG } from "@/core/config";
import { v4 as uuidv4 } from "uuid";
import { getExtension } from "hono/utils/mime";

export const saveFileToStatic = (kind: string, file: File) => {
  const extention = getExtension(file.type);
  const name = `${uuidv4()}.${extention}`;
  const destination = `${APP_CONFIG.static.location}/${kind}/${name}`;
  return Bun.write(destination, file);
};
