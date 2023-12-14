// Define the region of interest (geometry)
var point = ee.Geometry.Point(35.0535, 11.1255);

var image = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
    .filterBounds(point)
    .filterDate('2021-01-01', '2023-12-04')
    .sort('CLOUD_COVER')
    .first()
    .select(['B4', 'B3', 'B2']);

var visParams = { min: 0, max: 3000, bands: ['B4', 'B3', 'B2'] };

Map.centerObject(point, 8);
Map.addLayer(image, visParams, 'Landsat-8');

// Make the training dataset.
var training = image.sample({
    scale: 30,
    numPixels: 5000,
    seed: 0,
    geometries: true  // Set this to false to ignore geometries
});

Map.addLayer(training, {}, 'training', false);

// Instantiate the clusterer and train it.
var nClusters = 5;
var clusterer = ee.Clusterer.wekaKMeans(nClusters).train(training);

// Cluster the input using the trained clusterer.
var result = image.cluster(clusterer);

// Display the clusters with random colors.
Map.addLayer(result.randomVisualizer(), {}, 'clusters');

var legendKeys = ['One', 'Two', 'Three', 'Four', 'etc'];
var legendColors = ['#8DD3C7', '#FFFFB3', '#BEBADA', '#FB8072', '#80B1D3'];

// Reclassify the map
result = result.remap([0, 1, 2, 3, 4], [1, 2, 3, 4, 5]);

Map.addLayer(
    result, { min: 1, max: 5, palette: legendColors }, 'Labelled clusters'
);

// Add legend
var legend = ui.Panel({
    style: {
        position: 'bottom-right',
        padding: '8px 15px'
    }
});

legend.add(ui.Label('Cluster Legend'));

for (var i = 0; i < legendKeys.length; i++) {
    // Create a panel with a color and the legend label
    var entry = ui.Panel({
        style: { color: legendColors[i] }
    });

    // Add the colored box to the panel
    entry.add(ui.Label({
        style: {
            backgroundColor: legendColors[i],
            padding: '8px',
            margin: '0 0 4px 0'
        }
    }));

    // Add the legend key to the panel
    entry.add(ui.Label({
        value: legendKeys[i],
        style: { margin: '0 0 0px 6px' }
    }));

    // Add the panel to the legend
    legend.add(entry);
}

Map.add(legend);
