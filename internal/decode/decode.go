package decode

import (
	"reflect"

	"github.com/mitchellh/mapstructure"
)

type Decoder func(target interface{}, source interface{}) error

type MapUnmarshaler interface {
	UnmarshalMap(data map[interface{}]interface{}, decode Decoder) error
}

// HookUnmarshalMap is a mapstructure.DecodeHookFuncValue that enables decoding
// of any type that implements the MapUnmarshaler interface.
func HookUnmarshalMap(from reflect.Value, to reflect.Value) (interface{}, error) {
	if from == to {
		return from.Interface(), nil
	}

	unmapper, ok := to.Interface().(MapUnmarshaler)
	if !ok {
		if to.CanAddr() {
			unmapper, ok = to.Addr().Interface().(MapUnmarshaler)
		}
		if !ok {
			return from.Interface(), nil
		}
	}

	source, ok := asUntypedMap(from.Interface())
	if !ok {
		return from.Interface(), nil
	}

	// TODO: make this use the same DecodeConfig as the caller
	fn := func(target interface{}, source interface{}) error {
		cfg := &mapstructure.DecoderConfig{
			Result: target,
		}
		decoder, err := mapstructure.NewDecoder(cfg)
		if err != nil {
			return err
		}
		return decoder.Decode(source)
	}

	err := unmapper.UnmarshalMap(source, fn)
	return to.Interface(), err
}

func asUntypedMap(source interface{}) (map[interface{}]interface{}, bool) {
	v, ok := source.(map[interface{}]interface{})
	if ok {
		return v, true
	}

	// try to convert from map[string]interface{}
	tmp, ok := source.(map[string]interface{})
	if ok {
		target := make(map[interface{}]interface{}, len(tmp))
		for k, v := range tmp {
			target[k] = v
		}
		return target, true
	}

	return nil, false
}
