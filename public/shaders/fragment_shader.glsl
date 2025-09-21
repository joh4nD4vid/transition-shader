#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
varying vec2 v_uv;


uniform sampler2D texture_a;
uniform sampler2D texture_b;
uniform sampler2D depth_a;
uniform sampler2D depth_b;

uniform float u_transition;




void main() {


    vec4 paralaxe_color_a = texture( depth_a, v_uv );
    vec4 paralaxe_color_b = texture( depth_b, v_uv );

    float paralaxe_factor_a = paralaxe_color_a.r * 1.2;
    float paralaxe_factor_b = paralaxe_color_b.r * 1.0;

    

    float scale_factor_a = 1.0 - ( u_transition * 0.2 * paralaxe_factor_a );
    float scale_factor_b = 1.0 + ( ( 1.0 - u_transition ) * 0.2 * paralaxe_factor_b );
    
    float offset_factor_a = abs( 1.0 - scale_factor_a ) / 2.0;
    float offset_factor_b = abs( 1.0 - scale_factor_b ) / 2.0;

    vec2 scale_uv_a = ( v_uv * scale_factor_a ) + offset_factor_a;
    vec2 scale_uv_b = ( v_uv * scale_factor_b ) - offset_factor_b;



    vec4 texture_a = texture( texture_a, scale_uv_a );
    vec4 texture_b = texture( texture_b, scale_uv_b );
    
    vec4 depth_a = texture( depth_a, v_uv );
    vec4 depth_b = texture( depth_b, v_uv );

    vec4 color = mix( texture_a, texture_b, u_transition );
    vec4 colorB = mix( depth_a, depth_b, u_transition );
    // vec3 color = vec3(v_uv.x * u_transition, v_uv.y * u_transition, v_uv.x);
    // Couleur du fragment
    gl_FragColor = color;    

}