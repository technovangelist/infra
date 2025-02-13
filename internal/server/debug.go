package server

import (
	"net/http/pprof"

	"github.com/gin-gonic/gin"

	"github.com/infrahq/infra/internal/access"
	"github.com/infrahq/infra/internal/server/models"
)

func (a *API) pprofHandler(c *gin.Context) {
	if _, err := access.RequireInfraRole(c, models.InfraAdminRole); err != nil {
		a.sendAPIError(c, err)
		return
	}

	switch c.Param("profile") {
	case "/trace":
		pprof.Trace(c.Writer, c.Request)
	case "/profile":
		pprof.Profile(c.Writer, c.Request)
	default:
		// All other types of profiles are served from Index
		pprof.Index(c.Writer, c.Request)
	}
}
