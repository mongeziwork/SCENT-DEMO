export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string | null
          description: string | null
          price: number
          image_url: string | null
          stock: number | null
          is_active: boolean | null
          category: string | null
          color_options: string[] | null
          size_options: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          description?: string | null
          price: number
          image_url?: string | null
          stock?: number | null
          is_active?: boolean | null
          category?: string | null
          color_options?: string[] | null
          size_options?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          description?: string | null
          price?: number
          image_url?: string | null
          stock?: number | null
          is_active?: boolean | null
          category?: string | null
          color_options?: string[] | null
          size_options?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          status: string
          currency: string
          subtotal: number
          total: number
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          shipping_address: string | null
          payfast_payment_id: string | null
          payfast_m_payment_id: string | null
          payfast_pf_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          status?: string
          currency?: string
          subtotal?: number
          total?: number
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          shipping_address?: string | null
          payfast_payment_id?: string | null
          payfast_m_payment_id?: string | null
          payfast_pf_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          status?: string
          currency?: string
          subtotal?: number
          total?: number
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          shipping_address?: string | null
          payfast_payment_id?: string | null
          payfast_m_payment_id?: string | null
          payfast_pf_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          name: string
          slug: string | null
          price: number
          quantity: number
          color: string | null
          size: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          name: string
          slug?: string | null
          price: number
          quantity: number
          color?: string | null
          size?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          name?: string
          slug?: string | null
          price?: number
          quantity?: number
          color?: string | null
          size?: string | null
          image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
