import cartManager from '../services/cartService.js'

class CartController {
  async getCartById (req, res) {
    const { cid } = req.params
    try {
      const cart = await cartManager.getCartById(cid)
      res.status(200).json(cart.products)
    } catch (err) {
      if (err.message === `Cart not found with id: ${cid}`) {
        return res.status(400).json({
          success: false,
          message: `Cart not found with id: ${cid}`
        })
      }
      res.status(500).json({
        success: false,
        message: 'Unexpected error'
      })
    }
  }

  async addProducts (req, res) {
    const { cid, pid } = req.params
    try {
      const productToAdd = await cartManager.addProductsToCart(cid, pid)
      res.status(200).json({
        success: true,
        payload: productToAdd
      })
    } catch (err) {
      if (err.message === `Product not found with id: ${pid}`) {
        return res.status(400).json({
          status: false,
          message: `Product not found with id: ${pid}`
        })
      }
      if (err.message === `Cart not found with id: ${cid}`) {
        return res.status(400).json({
          status: false,
          message: `Cart not found with id: ${cid}`
        })
      }
      if (err.message === 'Not enough stock') {
        return res.status(400).json({
          status: false,
          message: 'Not enough stock'
        })
      }
      res.status(500).json({
        success: false,
        message: 'Unexpected error'
      })
    }
  }

  async updateCart (req, res) {
    try {
      const { cid } = req.params
      const { products } = req.body
      const cart = await cartManager.updateCart(cid, products)
      res.status(200).json({
        success: true,
        message: 'Cart updated successfully',
        payload: cart
      })
    } catch (err) {
      if (err.message === 'Error updating cart') {
        return res.status(400).json({
          success: false,
          message: 'Error updating cart'
        })
      }
      res.status(500).json({
        success: false,
        message: 'Unexpected error'
      })
    }
  }

  async updateQty (req, res) {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
      const cart = await cartManager.updateProductQuantity(cid, pid, quantity)
      res.status(200).json({
        success: true,
        message: 'Product quantity updated',
        payload: cart
      })
    } catch (err) {
      if (err.message === `Cart not found by id: ${cid}`) {
        return res.status(400).json({
          success: false,
          message: `Cart not found by id: ${cid}`
        })
      }
      if (err.message === 'Product not found in cart') {
        return res.status(400).json({
          success: false,
          message: 'Product not found in cart'
        })
      }
      res.status(500).json({
        success: false,
        message: 'Unexpected error'
      })
    }
  }

  async removeProducts (req, res) {
    const { cid, pid } = req.params
    try {
      await cartManager.removeProductsInCart(cid, pid)
      res.status(200).json({
        success: true
      })
    } catch (err) {
      if (err.message === `Cart not found with id: ${cid}`) {
        return res.status(400).json({
          success: false,
          message: `Cart not found with id: ${cid}`
        })
      }
      if (err.message === `Cart not found with id: ${cid}`) {
        return res.status(400).json({
          success: false,
          message: `Cart not found with id: ${cid}`
        })
      }
      res.status(500).json({
        success: false,
        message: 'Unexpected error'
      })
    }
  }

  async clearCart (req, res) {
    const { cid } = req.params
    try {
      await cartManager.clearCart(cid)
      res.status(200).json({
        success: true,
        message: 'Cart reseted succesfully'
      })
    } catch (err) {
      if (err.message === `Cart not found with id: ${cid}`) {
        return res.status(400).json({
          success: false,
          message: `Cart not found with id: ${cid}`
        })
      }
      res.status(500).json({
        error: 'Unexpected error'
      })
    }
  }

  async createCart (req, res) {
    try {
      const cart = await cartManager.createCart()
      res.status(201).json({
        message: 'Cart created succesfully',
        payload: cart
      })
    } catch (error) {
      if (error.message === 'Error creating cart') {
        return res.status(400).json({
          error: 'Error creating cart'
        })
      }
      res.status(500).json({
        status: false,
        message: 'Unexpected error'
      })
    }
  }

  async cartView (req, res) {
    if (!req.session.user) {
      res.render('login', { name: 'Login' })
    }
    const { cid } = req.params
    try {
      const cart = await cartManager.getCartById(cid)
      return res.status(200).render('cart', { name: 'Cart', cart, user: req.session.user })
    } catch (err) {
      if (err.message === `Cart not found with id: ${cid}`) {
        return res.status(400).json({
          status: false,
          message: `Cart not found with id: ${cid}`
        })
      }
      res.status(500).json({
        success: false,
        message: 'Unexpected error'
      })
    }
  }
}

export default new CartController()
