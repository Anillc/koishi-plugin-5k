import { Context, Dict, Schema, segment } from 'koishi'
import { AxiosResponse } from 'axios'

export const Config: Schema<{}> = Schema.object({})

export const name = '5k'

export function apply(ctx: Context) {
  ctx.command('5k <top:string> [bottom:string]', '5000兆円欲しい！', { checkArgCount: true })
    .option('quality', '-q <quality:number> 质量 (1 ~ 100)', { value: 100 })
    .option('alpha', '-a 使用透明通道', { value: false })
    .option('rainbow', '-r 彩虹色', { value: false })
    .option('single', '-s 只保留下方文字', { value: false })
    .before(({ options }) => {
      if (options.quality < 1 || options.quality > 100) return '请输入正确的数字。'
    })
    .action(async ({ options }, top, bottom = '欲しい！') => {
      try {
        const params: Dict<any> = {
          top, bottom,
          noalpha: 'true',
        }
        if (options.quality) params.q = options.quality
        if (options.alpha) delete params.noalpha
        if (!bottom && !options.single) params.hoshii = 'true'
        if (options.rainbow) params.ranbow = 'true'
        if (options.single) {
          params.single = 'true'
          delete params.bottom
        }
        // https://github.com/CyberRex0/5000choyen-api
        const img: AxiosResponse<ArrayBuffer> = await ctx.http.axios('https://gsapi.cbrx.io/image', {
          params,
          responseType: 'arraybuffer'
        })
        return segment.image(img.data, img.headers['content-type'])
      } catch (e) {
        return '请求失败，请检查参数后重试。'
      }
    })
}