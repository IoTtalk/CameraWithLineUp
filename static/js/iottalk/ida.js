function iottalk_register() {
    csmapi.set_endpoint('http://IP:9999');
    
    var profile = {
        'dm_name': '',
        'idf_list':[],
        'odf_list':[],
        'd_name': undefined,
    };
    /*******************************************************************/
    dai(profile, {'ida_init': function(){}});     
};
