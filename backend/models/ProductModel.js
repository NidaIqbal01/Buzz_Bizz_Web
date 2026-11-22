class ProductModel {
  constructor({
    id = null,
    userId = 1,
    name,
    category,
    cost = 0,
    price = 0,
    stock = 0,
    minStock = 5,
    image = "",
  } = {}) {
    this.id = id;
    this.userId = Number(userId) || 1;
    this.name = name;
    this.category = category;
    this.cost = Number(cost);
    this.price = Number(price);
    this.stock = Number(stock);
    this.minStock = Number(minStock);
    this.image = image;
  }

  validate() {
    if (!this.name || !String(this.name).trim()) {
      return "Product name is required.";
    }
    if (!this.category || !String(this.category).trim()) {
      return "Product category is required.";
    }
    if (Number.isNaN(this.cost) || this.cost <= 0) {
      return "Cost price must be greater than zero.";
    }
    if (Number.isNaN(this.price) || this.price <= 0) {
      return "Selling price must be greater than zero.";
    }
    if (this.price < this.cost) {
      return "Selling price cannot be lower than product cost.";
    }
    if (!Number.isInteger(this.stock) || this.stock < 0) {
      return "Stock must be a valid non-negative whole number.";
    }
    if (!Number.isInteger(this.minStock) || this.minStock < 0) {
      return "Minimum stock must be a valid non-negative whole number.";
    }
    return null;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      category: this.category,
      cost: this.cost,
      price: this.price,
      stock: this.stock,
      minStock: this.minStock,
      image: this.image,
    };
  }
}

module.exports = ProductModel;