// Ejemplo de datos estáticos
const sampleLocations = [
    { id: 1, name: "Madrid", lat: 40.4168, lng: -3.7038 },
    { id: 2, name: "Barcelona", lat: 41.3851, lng: 2.1734 },
];
export const getLocations = (_req, res) => {
    res.json(sampleLocations);
};
