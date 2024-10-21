package notes

import (
	"html/template"
	"bytes"

	"github.com/fluidity-money/long.so/lib/types"
)

type Args struct {
	Address types.Address
}

// Render what was given in its string format as a html template with
// optional arguments.
func Render(s string, args Args) (string, error) {
	var buf bytes.Buffer
	t, err := template.New("").Parse(s)
	if err != nil {
		return "", err
	}
	if err := t.Execute(&buf, args); err != nil {
		return "", err
	}
	return buf.String(), nil
}
