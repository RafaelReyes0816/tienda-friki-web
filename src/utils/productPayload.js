export const emptyProductForm = (categories) => ({
  nombre: '',
  precio: 0,
  stock: 0,
  imagen: '',
  franquicia: '',
  oferta: false,
  destacado: false,
  categoriaId: categories[0]?.id ?? '',
});

export const normalizeProductPayload = (data) => ({
  ...data,
  categoriaId: Number(data.categoriaId),
  precio: Number(data.precio),
  stock: Number(data.stock),
});
