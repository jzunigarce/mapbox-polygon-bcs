(function () {

	async function fetchData() {
		const response = await fetch("http://localhost:8080/municipios");
		const data = await response.json();
		return data;
	}

	const randColor = function() {
		const letters = '0123456789ABCDEF'
		return `#${Array.from(Array(6).keys(), a => letters[Math.floor(Math.random() * letters.length)]).join('')}`
	}

	const init = async function () {
		mapboxgl.accessToken = ""; //key mapbpx

		const map = new mapboxgl.Map({
			container: "map", 
			style: "mapbox://styles/mapbox/streets-v11", 
			center: [-110.413863, 24.096134], 
			zoom: 5, 
		});

		const {geoData} = await fetchData();

		console.log(geoData);
		let i = 1
		geoData.forEach(data => {
			let color = randColor()
			data.files.forEach(file => {
				let id = `${data.name}${i}`
				map.on("load", () => {
					map.addSource(id, {
						type: "geojson",
						data: file
					})

					map.addLayer({
						id: id,
						type: 'fill',
						source: id,
						paint: {
							"fill-color": color,
						},
					})
				})
				i++
			})
		})
	};
	init();
})();
