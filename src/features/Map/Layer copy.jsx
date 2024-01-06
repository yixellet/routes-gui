import { useEffect, useState } from 'react';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { useSelector } from 'react-redux';

const { host, port } = require('../../config/mapserver.config');

export const Layer2 = ({ map }) => {

  const archive = useSelector(state => state.controls.archive);
  
  const [landsLayer, setL] = useState(new Vector({
    zIndex: 10,
    map: map,
    style: {
      'stroke-width': 0.5,
      'stroke-color': 'black',
      'fill-color': 'rgba(100,100,100,0.29)',
    },
  }));

  landsLayer.setVisible(archive)
  useEffect(() => {
    landsLayer.setSource(new VectorSource({
      format: new GeoJSON(),
      url: `http://${host}:${port}/geoserver/invent/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=invent%3Anon_actual_rented_lands&outputFormat=application%2Fjson`
    }))
  }, [landsLayer])
  
  landsLayer.set('layer_name', 'non_actual_rented_lands', true)

  return null;
};
