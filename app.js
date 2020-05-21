
const express = require('express');
const path = require('path')
const fs = require('fs')

const app = express();
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.render('index');
})

app.get('/municipios', async (req, res) => {
	const filenames = [
		{
			name: 'laPaz',
			files: ['DISTRITO_02 LA PAZ', 'DISTRITO_03 LA PAZ', 'DISTRITO_04 LA PAZ', 'DISTRITO_05 LA PAZ', 'DISTRITO_06 LA PAZ', 'DISTRITO_15 LA PAZ']
		},
		{
			name: 'losCabos',
			files: ['DISTRITO_01 LOS CABOS', 'DISTRITO_07 LOS CABOS', 'DISTRITO_08 LOS CABOS', 'DISTRITO_09 LOS CABOS', 'DISTRITO_12 LOS CABOS', 'DISTRITO_16 LOS CABOS']
		},
		{
			name: 'comondu',
			files: ['DISTRITO_10 COMONDÚ', 'DISTRITO_11 COMONDÚ']
		},
		{
			name: 'loreto',
			files: ['DISTRITO_13 LORETO-MULEGÉ']
		},
		{
			name: 'mulege',
			files: ['DISTRITO_14 MULEGE', 'DISTRITO_13 LORETO-MULEGÉ']
		}
	]

	const geoData = []

	for(let i = 0; i < filenames.length; i++) {
		const files = []
		for(let j = 0; j < filenames[i].files.length; j++) {
			const data = await readFile(filenames[i].files[j])
			const parseData = JSON.parse(data)
			if(filenames[i].files[j] === 'DISTRITO_13 LORETO-MULEGÉ'){
				parseData.features = parseData.features.filter(f => {
					return (filenames[i].name === 'loreto' 
								&& (f.properties.MUNICIPIO === 5 || f.properties.description.indexOf("MUNICIPIO=5") != -1)) || 
							(filenames[i].name === 'mulege' 
								&& (f.properties.MUNICIPIO === 2 || f.properties.description.indexOf("MUNICIPIO=2") != -1))
					})
			}
			files.push(parseData)
		}
		geoData.push({
			name: filenames[i].name,
			files: files
		})
	}
	res.json({geoData})
})

const readFile = async function(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(`./data/${filename}.geojson`, 'utf-8', (err, data) => {
			//console.log(data)
			if(err)
				reject(err)
			else
				resolve(data)	
		})
	})
}

app.listen(8080, () => {
	console.log('Connect')
})