export class Pagination {

    // 数据加载状态
    loading = false;

    // 当前页面
    currentPage = 1

    // 每页显示的数据量
    limit = 10

    // 数据总数
    total = 0

    // 偏移量，当前已经显示的数据量
    get offset() {
        return (this.currentPage - 1) * this.limit
    }

    // 最大页数
    get maxPage() {
        return Math.ceil(this.total / this.limit)
    }

    // 判断是否有下一页
    hasNext() {
        return this.currentPage < this.maxPage
    }

    // 判断是否有上一页
    hasPre() {
        return this.currentPage > 1
    }

    // 重置分页
    reset() {
        this.currentPage = 1
        this.total = 0
        this.limit = 10
    }

    // 获取分页参数,可以附带额外参数
    params(appendParams = {}) {
        return Object.assign({
            offset: this.offset,
            limit: this.limit
        }, appendParams)
    }
}