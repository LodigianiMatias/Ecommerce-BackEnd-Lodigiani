import fs from 'fs'
import { v4 as uuid } from 'uuid'

export class ProductManager {
  constructor (path) {
    this.products = []
    this.path = path
  }

  async loadData () {
    if (!fs.existsSync(this.path)) {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products))
    } else {
      this.products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
      // ProductManager.#id = this.products[this.products.length - 1]?.id || 0
    }
  }

  async addProduct (product) {
    await this.loadData()
    const verify = this.products.find((cod) => cod.code === parseInt(product.code))
    if (verify !== undefined) {
      throw new Error('Product code already exists. Try with another code')
    }
    if (!product.title ||
            !product.desc ||
            !product.price ||
            !product.code ||
            !product.stock) {
      throw new Error('You must to complete all the fields')
    }
    product.thumbnails = product.thumbnails ? product.thumbnails : '/thumbnails/placeholder.png'
    product.price = parseFloat(product.price)
    product.stock = parseInt(product.stock)
    product.code = parseInt(product.code)
    const newProduct = { id: uuid(), ...product, status: product.status ?? true }
    this.products.push(newProduct)
    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
    return newProduct
  }

  async getProducts () {
    await this.loadData()
    return this.products.length > 0 ? this.products : 'There are no products in DB'
  };

  async getProductById (id) {
    await this.loadData()
    const findIndex = this.products.find((p) => p.id === id)
    if (findIndex) {
      return findIndex
    } else {
      throw new Error(`Product not found by id: ${id}`)
    }
  }

  async updateProduct (id, product) {
    await this.loadData()
    const searchProduct = this.products.findIndex((p) => p.id === id)

    if (searchProduct === -1) {
      return (`Product not found by id: ${id}`)
    };

    if (!product.title ||
            !product.desc ||
            !product.price ||
            !product.code ||
            !product.stock) {
      return ('You must to complete all the fields')
    }

    this.products[searchProduct].code = ''
    const verifyCode = this.products.find((cod) => cod.code === product.code)
    if (verifyCode !== undefined) {
      return ('Product code already exists')
    }

    this.products.splice(searchProduct, 1, { id, ...product })
    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
  }

  async deleteProduct (id) {
    await this.loadData()
    const productIndex = this.products.findIndex(p => p.id === id)
    if (productIndex === -1) {
      return (`Product not found by id: ${id}`)
    }
    this.products.splice(productIndex, 1)
    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
  }
}

export default new ProductManager('./src/database/db.json')
