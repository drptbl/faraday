// Faraday Penetration Test IDE
// Copyright (C) 2013  Infobyte LLC (http://www.infobytesec.com/)
// See the file 'doc/LICENSE' for the license information

angular.module('faradayApp')
    .controller('modalEditCtrl', ['$scope', '$modalInstance', 'EASEOFRESOLUTION', 'commonsFact', 'severities', 'vulns', 
        function($scope, $modalInstance, EASEOFRESOLUTION, commons, severities, vulns) {
        $scope.easeofresolution = EASEOFRESOLUTION;
        $scope.evidence = {};
        $scope.icons = {};
        $scope.severities = severities;
        $scope.vulns = vulns;
        $scope.web = false;
        $scope.mixed = 0x00;
        $scope.vulnc = 0;
        $scope.vulnid = 0;
        $scope.file_name_error = false;
        $scope.p_impact = {
            "accountability": false,
            "availability": false,
            "confidentiality": false,
            "integrity": false
        };
        $scope.impact = {
            "accountability": false,
            "availability": false,
            "confidentiality": false,
            "integrity": false
        };
        var vuln_mask = {"VulnerabilityWeb": 0x01, "Vulnerability": 0x10};

        $scope.pickVuln = function(v) {
            $scope.p_name = v.name;
            $scope.p_desc = v.desc;
            $scope.p_data = v.data;
            $scope.severitySelection = v.severity;
            $scope.easeOfResolutionSelection = v.easeofresolution;
            $scope.p_method = v.method;
            $scope.p_pname = v.pname;
            $scope.p_params = v.params;
            $scope.p_path = v.path;
            $scope.p_query = v.query;
            $scope.p_website = v.website;
            $scope.p_refs = v.refs;
            $scope.p_request = v.request;
            $scope.p_response = v.response;
            $scope.p_resolution = v.resolution;
            
            $scope.name = $scope.p_name;
            $scope.data = $scope.p_data;
            $scope.desc = $scope.p_desc;
            $scope.method = $scope.p_method;
            $scope.params = $scope.p_params;
            $scope.path = $scope.p_path;
            $scope.pname = $scope.p_pname;
            $scope.query = $scope.p_query;
            $scope.refs = $scope.p_refs;
            $scope.request = $scope.p_request;
            $scope.response = $scope.p_response;
            $scope.resolution = $scope.p_resolution;
            $scope.website = $scope.p_website;

            for(var key in v.impact) {
                $scope.impact[key] = v.impact[key];
                $scope.p_impact[key] = v.impact[key];
            }

        };

        $scope.toggleImpact = function(key) {
            $scope.impact[key] = !$scope.impact[key];
        };

        $scope.call = function(){
            $scope.refs = commons.arrayToObject($scope.refs);
        };
        vulnid_count=0
        $scope.vulns.forEach(function(v) {
            if(v.selected) {
                if(typeof(v.attachments) != undefined && v.attachments != undefined) {
                    v.attachments.forEach(function(name) {
                        $scope.evidence[name] = {"name": name};
                    });
                    $scope.icons = commons.loadIcons($scope.evidence); 
                }
                $scope.mixed = $scope.mixed | vuln_mask[v.type];
                $scope.vulnc++;
                $scope.vulnid = vulnid_count;
                if (v.type === "VulnerabilityWeb") {
                    $scope.web = true;
                    //web
                }
                
            }
            vulnid_count++;
            

        });

        if ($scope.vulnc == 1) {
            $scope.pickVuln($scope.vulns[$scope.vulnid]);
        }
        
        $scope.unit = $scope.vulnc == 1;
        
        if ($scope.vulnc > 1) {
            $scope.p_name = "";
            $scope.p_desc = "";
            $scope.p_data = "";
            $scope.p_method = "";
            $scope.p_pname = "";
            $scope.p_params = "";
            $scope.p_path = "";
            $scope.p_query = "";
            $scope.p_website = "";
            $scope.p_refs = "";
            $scope.p_request = "";
            $scope.p_response = "";
            $scope.p_resolution = "";
        }

        if($scope.mixed == 0x11) {
            $scope.mixed = true;
        } else {
            $scope.mixed = false;
        }

        $scope.isChecked = function(i) {
            return i.selected;
        };

        $scope.ok = function() {
            var res = {},
            evidence = [];

            for(var key in $scope.impact) {
                $scope.impact[key] = Boolean($scope.impact[key]);
            }

            for(var key in $scope.evidence) {
                if(Object.keys($scope.evidence[key]).length == 1) {
                    evidence.push(key);
                } else {
                    evidence.push($scope.evidence[key]);
                }
            }

            $scope.refs = commons.objectToArray($scope.refs);

            if($scope.web) { 
                res = {
                    "data":             $scope.data,
                    "desc":             $scope.desc,
                    "easeofresolution": $scope.easeOfResolutionSelection,
                    "evidence":         $scope.evidence,
                    "impact":           $scope.impact,
                    "method":           $scope.method,
                    "name":             $scope.name, 
                    "params":           $scope.params,
                    "path":             $scope.path,
                    "pname":            $scope.pname,
                    "query":            $scope.query,
                    "refs":             $scope.refs,
                    "request":          $scope.request,
                    "response":         $scope.response,
                    "resolution":       $scope.resolution,
                    "severity":         $scope.severitySelection, 
                    "vulns":            $scope.vulns, 
                    "website":          $scope.website
                };    
            } else {
                res = {
                    "data":         $scope.data,
                    "desc":         $scope.desc,
                    "easeofresolution": $scope.easeOfResolutionSelection,
                    "evidence":     $scope.evidence,
                    "impact":       $scope.impact,
                    "name":         $scope.name, 
                    "refs":         $scope.refs,
                    "resolution":   $scope.resolution,
                    "severity":     $scope.severitySelection, 
                    "vulns":        $scope.vulns 
                };
            }

            $modalInstance.close(res);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.refs = commons.arrayToObject($scope.refs);

        $scope.newReference = function($event){
            $scope.refs.push({key:''});
        };

        $scope.selectedFiles = function(files, e) {
            files.forEach(function(file) {
                if(file.name.charAt(0) != "_") {
                    if(!$scope.evidence.hasOwnProperty(file)) $scope.evidence[file.name] = file;
                } else {
                    $scope.file_name_error = true;
                }
            });
            $scope.icons = commons.loadIcons($scope.evidence); 
        }

        $scope.removeEvidence = function(name) {
            delete $scope.evidence[name];
            delete $scope.icons[name];
        }
    }]);
