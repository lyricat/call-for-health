export default {
  onCopy (vue) {
    vue.$toast({ message: '已复制', color: 'info' })
  },
  onError (vue) {
    vue.$toast({ message: '未复制成功', color: 'error' })
  }
}
