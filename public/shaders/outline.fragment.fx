precision highp float;
uniform float outlineWidth;
uniform vec4 outlineColor;
uniform sampler2D highlightedSampler; // Renders on highlight
uniform sampler2D originalSampler; // Renders default texture
uniform vec2 screenSize; // Renders default texture


varying vec2 vUV;


// Sebel edge detection



void make_kernel(inout vec4 n[9], sampler2D tex, vec2 coord)
    {
        float w = 0.001;
        float h = 0.001;

        n[0] = texture2D(tex, coord + vec2( -w, -h));
        n[1] = texture2D(tex, coord + vec2(0.0, -h));
        n[2] = texture2D(tex, coord + vec2(  w, -h));
        n[3] = texture2D(tex, coord + vec2( -w, 0.0));
        n[4] = texture2D(tex, coord);
        n[5] = texture2D(tex, coord + vec2(  w, 0.0));
        n[6] = texture2D(tex, coord + vec2( -w, h));
        n[7] = texture2D(tex, coord + vec2(0.0, h));
        n[8] = texture2D(tex, coord + vec2(  w, h));
}



void main() 
    {
        vec2 texelSize = vec2(1.0 / screenSize.x, 1.0 / screenSize.y);
        vec4 baseColor = texture2D(originalSampler, vUV);

        vec4 n[9];
        make_kernel( n, highlightedSampler, vUV);

        vec4 sobel_edge_h = n[2] + (8.0*n[5]) + n[8] - (n[0] + (8.0*n[3]) + n[6]);
        vec4 sobel_edge_v = n[0] + (8.0*n[1]) + n[2] - (n[6] + (8.0*n[7]) + n[8]);

        vec4 sobel = sqrt((sobel_edge_h * sobel_edge_h) + (sobel_edge_v * sobel_edge_v));
        
        // Normalize sobel colors

        sobel= vec4(sobel.rgb / vec3(1.0, 1.0, 1.0), 1.0);

        
        gl_FragColor = vec4(mix(baseColor.rgb, outlineColor.rgb, sobel.rgb), 1.0);

    }
    