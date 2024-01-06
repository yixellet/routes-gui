import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { open, close as clll, setCN, setCNtoNull } from '../LandInfo/landInfoSlice';
import { close } from '../Landusers/landusersSlice';
import { close as ww } from '../LandsNotInEGRN/LandsNotInEGRNSlice';

const { host, port } = require('../../config/mapserver.config');

export const Layer = ({ map }) => {

  const dispatch = useDispatch();
  
  const [landsLayer, setL] = useState(new Vector({
    zIndex: 10,
    map: map,
    style: {
      'stroke-width': 0.5,
      'stroke-color': 'black',
      'fill-color': 'rgba(255,155,97,0.29)',
    },
  }));
  landsLayer.set('layer_name', 'actual_rented_lands', true)
  useEffect(() => {
    landsLayer.setSource(new VectorSource({
      format: new GeoJSON(),
      url: `http://${host}:${port}/geoserver/invent/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=invent%3Aactual_rented_lands&outputFormat=application%2Fjson`
    }))
  },[landsLayer])
  
  const [featureOverlay, setFeatureOverlay] = useState(new Vector({
    source: new VectorSource(),
    map: map,
    style: {
      'stroke-color': 'rgba(255, 255, 255, 0.7)',
      'stroke-width': 2,
    },
  }));
  
  const [featureSelect, setFeatureSelect] = useState(new Vector({
    source: new VectorSource(),
    map: map,
    style: {
      'fill-color': 'rgba(255,0,0,0.29)',
      'stroke-color': 'rgba(255, 0, 0, 0.7)',
      'stroke-width': 2,
    },
  }));
  useEffect(() => {
    let highlight;
    const displayFeatureInfo = function (pixel) {
      const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
    
      if (feature !== highlight) {
        if (highlight) {
          featureOverlay.getSource().removeFeature(highlight);
        }
        if (feature) {
          featureOverlay.getSource().addFeature(feature);
        }
        highlight = feature;
      }
    };
    
    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });
  })
  useEffect(() => {
    let select = null;
    const selectFeature = function(pixel) {
      const feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        return feature;
      }, {layerFilter: function(layer){
        return layer.get('layer_name') === 'actual_rented_lands' || layer.get('layer_name') === 'non_actual_rented_lands'
      }});
      if (feature !== select) {
        if (select) {
          featureSelect.getSource().removeFeature(select);
        };
        if (feature) {
          featureSelect.getSource().addFeature(feature);
          dispatch(setCN(feature.get('cadastral_number')));
          dispatch(open());
          dispatch(close());
          dispatch(ww())
        };
        select = feature;
      } else {
        featureSelect.getSource().removeFeature(feature);
        select = null;
        dispatch(setCNtoNull());
        dispatch(clll())
      };
      return feature;
    };
  
    map.on('singleclick', function (evt) {
      const pixel = map.getEventPixel(evt.originalEvent);    
      selectFeature(pixel);
    });
  })

  return null;
}