export class EncoderService {
  decode(token) {
    return Buffer.from(token, 'base64').toString();
  }
}
