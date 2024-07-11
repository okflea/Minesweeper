package models

import "time"

type Highscore struct {
	ID         int       `json:"id"`
	Name       string    `json:"name"`
	Score      int       `json:"score"`
	Difficulty string    `json:"difficulty"`
	Date       time.Time `json:"date"`
}
