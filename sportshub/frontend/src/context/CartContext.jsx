import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import client from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([])
      setTotal(0)
      return
    }
    setLoading(true)
    try {
      const res = await client.get('/cart')
      setItems(res.data.items)
      setTotal(res.data.total)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = async (productId, quantity = 1) => {
    await client.post('/cart', { product_id: productId, quantity })
    await refreshCart()
  }

  const updateQuantity = async (itemId, quantity) => {
    await client.put(`/cart/${itemId}`, { quantity })
    await refreshCart()
  }

  const removeItem = async (itemId) => {
    await client.delete(`/cart/${itemId}`)
    await refreshCart()
  }

  const clearCart = async () => {
    await client.delete('/cart')
    await refreshCart()
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, total, count, loading, addToCart, updateQuantity, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
