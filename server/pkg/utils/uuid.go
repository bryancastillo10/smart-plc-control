package utils

import "github.com/google/uuid"

func ParseId(id string) (uuid.UUID, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return uuid.UUID{}, err
	}
	return uid, nil
}
