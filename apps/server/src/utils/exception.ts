export class BizException extends Error {
  code: number

  constructor(message: string, code: number = 400) {
    super(message)
    this.name = 'BizException'
    this.code = code
  }
}