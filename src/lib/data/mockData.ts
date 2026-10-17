export const user = {
	name: 'Luis Fernando',
	level: 'Nivel Bronce',
	points: 0,
	progress: 0,
};

export const categories = [
	{ id: 'salud-y-belleza', name: 'Salud y Belleza', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' }, // using a heart icon path as placeholder
	{ id: 'supermercado', name: 'Supermercado', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.29 2.29c-.63.63-.18 1.71.71 1.71h12.58' },
	{ id: 'hogar', name: 'Hogar', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
	{ id: 'entretenimiento', name: 'Entretenimiento', icon: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7' },
	{ id: 'estacion-de-servicios', name: 'Estación de servicios', icon: 'M3 3v18h18M3 12h18' },
	{ id: 'comida', name: 'Comida', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
	{ id: 'moda', name: 'Moda', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
	{ id: 'delivery', name: 'Delivery', icon: 'M3 3h18v18H3z' },
	{ id: 'hospedaje', name: 'Hospedaje', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
	{ id: 'viajes', name: 'Viajes', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
];

export const merchants = [
	{ id: 'farmacorp', name: 'Farmacorp', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Farmacorp_logo.png' }, // placeholder
	{ id: 'amarket', name: 'Amarket', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Farmacorp_logo.png' } // placeholder
];

export const vouchers = [
	{
		id: 1,
		title: 'Arrurru Colonia Original X 120Ml Azul',
		points: 4040,
		image: 'https://via.placeholder.com/150x300.png?text=Colonia+Azul',
		merchantId: 'farmacorp',
		categoryId: 'salud-y-belleza'
	},
	{
		id: 2,
		title: 'Arrurru Colonia Original X 220Ml Rosado',
		points: 5960,
		image: 'https://via.placeholder.com/150x300.png?text=Colonia+Rosada',
		merchantId: 'farmacorp',
		categoryId: 'salud-y-belleza'
	},
	{
		id: 3,
		title: 'Arrurru Shampoo Original X 400Ml Azul',
		points: 3500,
		image: 'https://via.placeholder.com/150x300.png?text=Shampoo',
		merchantId: 'farmacorp',
		categoryId: 'salud-y-belleza'
	},
	{
		id: 4,
		title: 'Arrurru Aceite X 200Ml Rosado',
		points: 2800,
		image: 'https://via.placeholder.com/150x300.png?text=Aceite',
		merchantId: 'farmacorp',
		categoryId: 'salud-y-belleza'
	}
];
