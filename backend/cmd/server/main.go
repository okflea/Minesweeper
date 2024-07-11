package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"okflea/Minesweeper/backend/internal/models"
)

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	if err := r.Run(":8080"); err != nil {
		log.Fatal("failed to run server", err)
	}
}
